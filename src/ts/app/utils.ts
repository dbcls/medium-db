export function getPram():string{
  return location.pathname.split("/").pop();
}
