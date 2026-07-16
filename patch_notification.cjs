const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldNotificationCode = `  useEffect(() => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const checkTimeForNotification = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      const timeKey = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + "-" + hours;
      const lastNotified = localStorage.getItem("lastAttendanceNotify");

      if (lastNotified === timeKey) return;

      if ((hours === 7 || hours === 13 || hours === 18) && minutes === 0) {
        if (Notification.permission === "granted") {
          new Notification("হাজিরা রিমাইন্ডার", {
            body: "অনুগ্রহ করে আপনার আজকের হাজিরা নিশ্চিত করুন।",
            icon: "/pwa-192x192.png"
          });
          localStorage.setItem("lastAttendanceNotify", timeKey);
        }
      }
    };

    const timeInterval = setInterval(checkTimeForNotification, 60000);
    checkTimeForNotification();

    return () => clearInterval(timeInterval);
  }, []);`;

const newNotificationCode = `  useEffect(() => {
    try {
      if ('Notification' in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
          Notification.requestPermission().catch(console.error);
        }
      }
    } catch (e) {
      console.error("Notification permission error:", e);
    }

    const checkTimeForNotification = () => {
      try {
        if (!('Notification' in window)) return;
        
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        const timeKey = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + "-" + hours;
        const lastNotified = localStorage.getItem("lastAttendanceNotify");

        if (lastNotified === timeKey) return;

        if ((hours === 7 || hours === 13 || hours === 18) && minutes === 0) {
          if (Notification.permission === "granted") {
            try {
              new Notification("হাজিরা রিমাইন্ডার", {
                body: "অনুগ্রহ করে আপনার আজকের হাজিরা নিশ্চিত করুন।",
                icon: "/pwa-192x192.png"
              });
            } catch (err) {
              console.error("Error showing notification:", err);
            }
            localStorage.setItem("lastAttendanceNotify", timeKey);
          }
        }
      } catch (err) {
        console.error("Notification check error:", err);
      }
    };

    const timeInterval = setInterval(checkTimeForNotification, 60000);
    checkTimeForNotification();

    return () => clearInterval(timeInterval);
  }, []);`;

code = code.replace(oldNotificationCode, newNotificationCode);
fs.writeFileSync('src/App.tsx', code);
