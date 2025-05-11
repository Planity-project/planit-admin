import MemberEdit from "@/components/MemberEidt/index";

const MemberEditPage = ({ id }: any) => {
  return <MemberEdit id={Number(id)} />;
};

export default MemberEditPage;

export async function getServerSideProps(context: any) {
  const { id } = context.params;

  return {
    props: {
      id,
    },
  };
}
