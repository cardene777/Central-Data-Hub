import { useRouter } from "next/router";

const DetailsPage = () => {
  const router = useRouter();
  const { index } = router.query;

  return (
    <div>
      <h1>Details Page</h1>
      <p>Index: {index}</p>
    </div>
  );
};

export default DetailsPage;
