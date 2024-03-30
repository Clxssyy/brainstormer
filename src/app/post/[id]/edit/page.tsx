import EditStudio from "./_components/EditStudio"

const EditPage = ({params} : {params: {id: string}}) => {
  return (
    <div>
     <EditStudio id={params.id}/>
    </div>
    )
};

export default EditPage;
