export type Unit = {
  id: string;
  name: string;
  address: string;
  note: string;
};

export type Department = {
  id: string;
  name: string;
  unitId: string;
  note: string;
};
