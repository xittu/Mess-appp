const fs = require('fs');
let code = fs.readFileSync('src/components/JobRegisterTab.tsx', 'utf8');

const oldClose = `              </div>
            )}
          </div>
        )}

        {/* History View */}`;

const newClose = `              </div>
            )}
          </div>
          </div>
        )}

        {/* History View */}`;

code = code.replace(oldClose, newClose);
fs.writeFileSync('src/components/JobRegisterTab.tsx', code);
