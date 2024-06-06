import { useRouter } from "next/router";

const AddressPage = () => {
  const router = useRouter();
  const { address } = router.query;

  return (
    <div>
      <h1>Details Page</h1>
      <p>Index: {index}</p>
    </div>
  );
};

export default DetailsPage;
