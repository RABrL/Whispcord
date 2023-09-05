interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage = ({ params }: ChannelIdPageProps) => {
  return <div>ChannelIdPage {params.channelId}</div>
}

export default ChannelIdPage
