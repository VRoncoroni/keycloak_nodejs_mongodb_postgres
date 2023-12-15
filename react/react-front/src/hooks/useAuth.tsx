import { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";
import { notify } from "../utils";

const client = new Keycloak({
    url: 'http://localhost:8080/auth',
    realm: 'MyRealm',
    clientId: 'node-client',
});    

const useAuth = () => {
    const isRun = useRef(false);
    const [token, setToken] = useState<string | null>(null);
    const [isLogin, setLogin] = useState(false);

    useEffect(() =>  {
        if (isRun.current) return;
        isRun.current = true;

        const loginRequired = async () => {
            try{
                const result = await client.init({
                    onLoad: "login-required",
                    
                })
                setLogin(result);
                setToken(client.token ?? null);
            } catch (error: unknown) {
                notify(500, "Keycloak Server Error");
            }
        }

        loginRequired().catch((e) => {
                console.log("erreur :" + e);
        });
    }, []);

    const handleLogout = () => {
        if (client) {
            client.logout();
            setLogin(false);
            setToken(null); 
        }
    };
    return { isLogin, token, logout: handleLogout, name: client.tokenParsed?.given_name};
};

export default useAuth;