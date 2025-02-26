import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import {
  MuliColumnVideo,
  Layout,
  LoadingMessage,
  ErrorMessage,
} from "../Components/Components";

const Home: NextPage = () => {
  const { data, isLoading, error } = api.video.getRandomVideos.useQuery(40);
  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (error || !data || data.videos.length === 0) {
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="No Videos"
          description="Sorry there is no videos at this time."
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Head>
        <title>Krysonix</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {!data || data.videos.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <Error />
          </div>
        ) : (
          <>
            <MuliColumnVideo
              videos={data.videos.map((video) => ({
                id: video?.id || "",
                title: video?.title || "",
                thumbnailUrl: video?.thumbnailUrl || "",
                createdAt: video?.createdAt || new Date(),
                views: video?.views || 0,
              }))}
              users={data.users.map((user) => ({
                name: user?.name || "",
                image: user?.image,
              }))}
            />
          </>
        )}
      </Layout>
    </>
  );
};

export default Home;
