// routes.jsx
import Home from '../pages/Home';
import Uploads from '../pages/Uploads';
import Drafts from '../pages/Drafts';
import Playback from '../pages/Playback';
import Camera from '../pages/Camera';

const routes = [
    {
        path: '/',
        element: <Home />,
        name: 'Home',
    },
    {
        path: '/uploads',
        element: <Uploads />,
        name: 'Uploads',
    },
    {
        path: '/drafts',
        element: <Drafts />,
        name: 'Drafts',
    },
    {
        path: '/playback',
        element: <Playback />,
        name: 'Playback',
    },
    {
        path: '/camera',
        element: <Camera />,
        name: 'Camera',
    },
];

export default routes;
