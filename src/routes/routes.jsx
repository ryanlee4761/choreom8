import { Navigate } from 'react-router-dom';
import Uploads from '../pages/Uploads';
import Drafts from '../pages/Drafts';
import Camera from '../pages/Camera';

const routes = [
    { 
        path: '/', 
        element: <Navigate to="/uploads" replace />
     },
    { 
        path: '/uploads', 
        element: <Uploads />,
        name: 'Uploads'
     },
    {
        path: '/drafts',
        element: <Drafts />,
        name: 'Drafts',
    },
    {
        path: '/camera',
        element: <Camera />,
        name: 'Camera',
    },
];

export default routes;
