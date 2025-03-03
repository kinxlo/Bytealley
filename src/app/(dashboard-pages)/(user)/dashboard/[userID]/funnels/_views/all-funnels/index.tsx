import { FunnelService } from "~/features/funnel";
import FunnelCard from "../../_components/funnel-card";

export const AllFunnels = ({ service }: { service: FunnelService }) => {
  return (
    <section>
      <FunnelCard
        template={{
          id: "",
          title: "Funnel One",
          thumbnail: "",
          created_at: "1 March 2025",
          status: "Published",
          url: undefined,
          template: undefined,
        }}
      />
    </section>
  );
};
