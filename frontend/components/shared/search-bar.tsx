import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <>
      <Field orientation="horizontal" className="flex-center">
        <Input type="search" placeholder="Search products..." className="rounded-md bg-gray-200 w-[98%]" />
      </Field>
    </>
  );
};

export default SearchBar;
