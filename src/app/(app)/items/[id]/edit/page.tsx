import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { items } from "@/db/schema";
import { DeleteButton } from "@/components/delete-button";
import { ItemForm } from "@/components/item-form";
import { updateItem } from "@/lib/actions";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item] = await db.select().from(items).where(eq(items.id, id)).limit(1);
  if (!item) notFound();

  const updateWithId = updateItem.bind(null, item.id);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Modifier</h2>
      <ItemForm item={item} action={updateWithId} submitLabel="Enregistrer" />
      <DeleteButton id={item.id} />
    </div>
  );
}
