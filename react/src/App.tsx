import { Shell } from "@/components/layout/Shell";
import { config } from "@/config";
import { AppProvider } from "@/store/AppProvider";

export function App() {
  return (
    <AppProvider emptyState={config.emptyState}>
      <Shell />
    </AppProvider>
  );
}
