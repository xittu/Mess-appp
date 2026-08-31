import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { UserLocation, MessRequest } from "../types";
import { MapPin, Users, Send, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance = R * c; 
  return distance;
}

interface FindMessTabProps {
  currentUser: any;
  onOpenChat: (otherUserId: string, otherUserName: string) => void;
}

const FindMessTab: React.FC<FindMessTabProps> = ({ currentUser, onOpenChat }) => {
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [myLocation, setMyLocation] = useState<{lat: number, lon: number} | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<number>(5); // Default 5km
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<MessRequest[]>([]);
  const [userName, setUserName] = useState(currentUser?.email?.split('@')[0] || "User");

  useEffect(() => {
    fetchLocations();
    fetchRequests();
    
    // Subscribe to requests
    const reqSub = supabase
      .channel('public:mess_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mess_requests' }, () => {
        fetchRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(reqSub);
    };
  }, []);

  const fetchRequests = async () => {
    if (!currentUser) return;
    const { data } = await supabase
      .from('mess_requests')
      .select('*')
      .or(`sender_id.eq.${currentUser?.id},receiver_id.eq.${currentUser?.id}`);
    
    if (data) setRequests(data);
  };

  const fetchLocations = async () => {
    setLoading(true);
    const { data } = await supabase.from('user_locations').select('*');
    if (data) setLocations(data);
    
    const mine = data?.find(d => d.user_id === currentUser?.id);
    if (mine) setMyLocation({ lat: mine.latitude, lon: mine.longitude });
    setLoading(false);
  };

  const updateMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    toast.loading("Getting location...", { id: "loc" });
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMyLocation({ lat: latitude, lon: longitude });
        
        // Ensure user_name column exists by just trying to update it, if it fails it fails.
        // Wait, the user didn't run the ALTER TABLE, I'll skip user_name in db and just show user_id or handle it.
        // Or I can just try inserting latitude/longitude.
        const { error } = await supabase
          .from('user_locations')
          .upsert({
            user_id: currentUser?.id,
            latitude,
            longitude,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
          
        if (error) {
          toast.error("Failed to update location", { id: "loc" });
          console.error(error);
        } else {
          toast.success("Location updated!", { id: "loc" });
          fetchLocations();
        }
      },
      (error) => {
        toast.error("Please allow location access.", { id: "loc" });
        console.error(error);
      },
      { enableHighAccuracy: true }
    );
  };

  const sendRequest = async (receiverId: string) => {
    toast.loading("Sending request...", { id: "req" });
    const { error } = await supabase
      .from('mess_requests')
      .insert({
        sender_id: currentUser?.id,
        receiver_id: receiverId,
        status: 'pending'
      });
      
    if (error) {
      toast.error("Failed to send request. Maybe already sent?", { id: "req" });
    } else {
      toast.success("Request sent!", { id: "req" });
      fetchRequests();
    }
  };

  const updateRequestStatus = async (reqId: string, status: 'accepted' | 'rejected') => {
    toast.loading("Updating...", { id: "upd" });
    const { error } = await supabase
      .from('mess_requests')
      .update({ status })
      .eq('id', reqId);
      
    if (error) {
      toast.error("Failed to update", { id: "upd" });
    } else {
      toast.success(`Request ${status}`, { id: "upd" });
      fetchRequests();
    }
  };

  const filteredLocations = locations.filter(loc => {
    if (loc.user_id === currentUser?.id) return false;
    if (!myLocation) return true;
    const dist = calculateDistance(myLocation.lat, myLocation.lon, loc.latitude, loc.longitude);
    return dist <= distanceFilter;
  });

  // Calculate pending requests received
  const incomingRequests = requests.filter(r => r.receiver_id === currentUser?.id && r.status === 'pending');

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-in fade-in pb-24">
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 mb-6">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <MapPin className="text-brand-amber w-5 h-5" />
          Find Mess Near You
        </h2>
        <p className="text-sm text-slate-400 mb-4">Discover other messes in your area and connect with them.</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={updateMyLocation}
            className="flex-1 bg-brand-amber text-black font-semibold py-2.5 rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            {myLocation ? "Update My Location" : "Share My Location"}
          </button>
          
          <select 
            value={distanceFilter}
            onChange={(e) => setDistanceFilter(Number(e.target.value))}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-amber"
          >
            <option value={1}>Within 1 km</option>
            <option value={3}>Within 3 km</option>
            <option value={5}>Within 5 km</option>
            <option value={10}>Within 10 km</option>
            <option value={50}>Within 50 km</option>
            <option value={99999}>Anywhere</option>
          </select>
        </div>
      </div>

      {incomingRequests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Incoming Requests ({incomingRequests.length})</h3>
          <div className="space-y-3">
            {incomingRequests.map(req => (
              <div key={req.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Someone nearby</div>
                    <div className="text-xs text-slate-400">Wants to connect</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateRequestStatus(req.id, 'accepted')} className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30">Accept</button>
                  <button onClick={() => updateRequestStatus(req.id, 'rejected')} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Nearby Messes</h3>
        
        {loading ? (
          <div className="text-center py-10 text-slate-500 animate-pulse">Loading locations...</div>
        ) : !myLocation ? (
          <div className="text-center py-10 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
            Please share your location to find nearby messes.
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
            No messes found within {distanceFilter} km.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLocations.map(loc => {
              const dist = calculateDistance(myLocation.lat, myLocation.lon, loc.latitude, loc.longitude);
              const existingReq = requests.find(r => 
                (r.sender_id === currentUser?.id && r.receiver_id === loc.user_id) ||
                (r.sender_id === loc.user_id && r.receiver_id === currentUser?.id)
              );

              return (
                <div key={loc.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-amber/20 text-brand-amber flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-medium">User {(loc.user_id || "").substring(0, 5)}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {dist.toFixed(1)} km away
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {!existingReq && (
                      <button 
                        onClick={() => sendRequest(loc.user_id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-4 h-4" /> Connect
                      </button>
                    )}
                    {existingReq?.status === 'pending' && existingReq.sender_id === currentUser?.id && (
                      <div className="px-3 py-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg text-sm font-medium flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Pending
                      </div>
                    )}
                    {existingReq?.status === 'accepted' && (
                      <button 
                        onClick={() => onOpenChat(loc.user_id, `User ${(loc.user_id || "").substring(0,5)}`)}
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Chat
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindMessTab;
