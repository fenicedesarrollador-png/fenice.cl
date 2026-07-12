import { FormPageHeader } from "../../_components/ui";
import PromoForm from "../_PromoForm";

export default function NuevaPromoPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl mx-auto admin-rise">
      <FormPageHeader title="Nueva promoción" subtitle="Crea una campaña con descuento y vigencia" backHref="/admin/promociones" />
      <PromoForm />
    </div>
  );
}
