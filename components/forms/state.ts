import { atom, atomFamily } from "recoil";

export const formData = atomFamily({
  key: "formData",
  default: "",
});

export const formFieldIDs = atom<string[]>({
  key: "formFieldIDs",
  default: [],
});
