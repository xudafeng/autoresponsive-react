import React from 'react';
import { createRoot } from 'react-dom/client';

import WaterfallExampleComponent from './waterfall';

const root = createRoot(document.querySelector('#app'));
root.render(<WaterfallExampleComponent />);
