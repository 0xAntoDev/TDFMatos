import { ItemForm } from "@/components/item-form";
import { createItem } from "@/lib/actions";

export default function NewItemPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Ajouter du matos</h2>
      <ItemForm action={createItem} submitLabel="Ajouter" />
    </div>
  );
}
