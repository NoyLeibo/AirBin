import { stayService } from "../services/stay.service.local";
export function StickyCard(stay) {
  return (
    <section className="stay-details-stickyCard flex column align-center">
      <h1>${stay.price}</h1>
    </section>
  );
}
