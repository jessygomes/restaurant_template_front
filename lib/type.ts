export interface UserInfo {
  id: string;
  email: string;
  restaurantName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  hours: {
    [key: string]: {
      open: string;
      close: string;
    } | null;
  };
}

export interface Reservation {
  id: string;
  date: string; // ou Date si tu les manipules directement comme objets Date
  arrivalTime: string;
  guests: number;
  status: "Attente" | "Confirmée" | "Annulée"; // Enum à adapter selon ta définition exacte

  isPrivate: boolean;
  privateFrom?: string;
  privateTo?: string;

  clientId?: string;
  client?: Client;

  tables: ReservationOnTable[];

  createdAt: string;
  updatedAt: string;
}

export interface ReservationListItem {
  id: string;
  date: string;
  arrivalTime: string;
  guests: number;
  status: "Attente" | "Confirmée" | "Annulée"; // Enum à adapter selon ta définition exacte
  isPrivate: boolean;
  privateFrom?: string;
  privateTo?: string;

  client?: Client;
  tables: {
    tableId: string;
    table: Table;
  }[];
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  reservation: ReservationForClientPage[];
  // ...autres champs
}

interface ReservationForClientPage {
  date: string;
  arrivalTime: string;
  guests: number;
  status: "Attente" | "Confirmée" | "Annulée";
  isPrivate?: boolean;
}

export interface ReservationOnTable {
  id: string;
  reservationId: string;
  tableId: string;
  // Tu peux aussi inclure la relation complète si besoin :
  // table: Table;
}

export interface Table {
  id: string;
  name: string;
  type: string;
  capacity: number;
  isReserved: boolean;
}

export interface MenuProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  available: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    type: string;
  };
}

export interface CategoryProps {
  id: string;
  name: string;
  type: string;
}
