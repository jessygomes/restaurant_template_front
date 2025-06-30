import * as z from "zod";

//! USER
export const userLoginSchema = z.object({
  email: z.string().email({
    message: "Un email valide est requis.",
  }),
  password: z.string().min(1, "Le mot de passe est requis."),
  code: z.optional(z.string()), // Pour Auhtentification à deux facteurs
});

export const tokenSchema = z.object({
  token: z.string(),
});

const timeSchema = z
  .string()
  .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Heure invalide")
  .or(z.literal("")) // accepte une chaîne vide
  .or(z.null()); // accepte aussi null

export const getAuthenticatedUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  restaurantName: z.string(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  hours: z.record(
    z.string(), // jours
    z.object({
      open: timeSchema.optional(),
      close: timeSchema.optional(),
    })
  ),
  role: z.enum(["user", "admin"]),
});

export const updateUserSchema = z.object({
  email: z.string().email({
    message: "Un email valide est requis.",
  }),
  restaurantName: z.string().min(1, "Le nom du restaurant est requis."),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  hours: z.record(
    z.string(), // jours
    z.object({
      open: timeSchema.optional(),
      close: timeSchema.optional(),
    })
  ),
});

//! TABLE
export const tableSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.string().min(1, "Le type est requis"),
  capacity: z.coerce.number().int().min(1, "Capacité minimale : 1"),
});

//! RESERVATION
export const reservationSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date invalide",
  }),
  arrivalTime: timeSchema,
  guests: z.coerce.number().int().min(1, "Nombre de convives requis"),
  status: z.enum(["Attente", "Confirmée", "Annulée"]),
  isPrivate: z.boolean(),
  privateFrom: timeSchema.optional(),
  privateTo: timeSchema.optional(),
  tableIds: z.array(z.string()),
  client: z.object({
    email: z.string().email(),
    firstName: z.string().min(1, "Prénom requis"),
    lastName: z.string().min(1, "Nom requis"),
    phone: z.string().min(5, "Téléphone requis"),
  }),
});

//! CLIENT
export const clientSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  phone: z.string().min(5, "Le téléphone est requis"),
  email: z.string().email("Un email valide est requis"),
});

//! CATEGORY
export const categorySchema = z.object({
  name: z.string().min(1, "Le nom de la catégorie est requis"),
  type: z.enum(["Saisonnier", "Suggestion", "Signature"]),
});

//! MENU
export const menuSchema = z.object({
  title: z.string().min(1, "Le nom du menu est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.coerce.number().min(0.01, "Le prix doit être supérieur à 0"),
  image: z.string().optional(),
  ingredients: z.array(z.object({ value: z.string().min(1) })).refine(
    (items) => {
      const values = items.map((i) => i.value.toLowerCase().trim());
      return new Set(values).size === values.length;
    },
    { message: "Les ingrédients doivent être uniques" }
  ),
  // .min(1, "Au moins un ingrédient est requis"),
  available: z.boolean(),
  categoryId: z.string().min(1, "La catégorie est requise"),
});
