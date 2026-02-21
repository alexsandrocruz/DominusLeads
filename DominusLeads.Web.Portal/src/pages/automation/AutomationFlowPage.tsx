import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AutomationFlowPage() {
    const [, setLocation] = useLocation();

    useEffect(() => {
        setLocation("/automation/sequences");
    }, [setLocation]);

    return null;
}
