import { atom } from "jotai";

const expandSidebar = atom(true);
const accessFromDesktop = atom(false);

const limit = atom(5);
const getLimit = atom((get) => get(limit));

const page = atom(1);
const getPage = atom((get) => get(page));

export { accessFromDesktop, expandSidebar, getLimit, getPage, limit, page };
