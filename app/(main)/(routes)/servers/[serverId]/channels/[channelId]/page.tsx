const ChannelIdPage = ({ params }: { params: { channelId: string } }) => {
  console.log(params)
  return <div>ChannelIdPage {params.channelId}</div>
}

export default ChannelIdPage
