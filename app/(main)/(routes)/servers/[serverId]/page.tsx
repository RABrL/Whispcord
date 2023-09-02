interface ServerIdPageProps {
  params: { serverId: string }
}

const ServerIdPage = ({params}: ServerIdPageProps) => {
  return ( <div>este el servidor {params.serverId}</div> );
}
 
export default ServerIdPage