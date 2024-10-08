import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './components/App.tsx'
import './styles/index.scss'
import {store} from "./utils/store.ts";
import {Provider} from "react-redux";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </StrictMode>,
)
