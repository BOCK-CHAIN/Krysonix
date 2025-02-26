import { type NextPage } from "next";
import Head from "next/head";
import {
  ErrorMessage,
  Layout,
  LoadingMessage,
  Thumbnail,
} from "../Components/Components";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Eye, UserCheck, Heart } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/Components/ui/table";
import { Badge } from "~/Components/ui/badge";
import { UploadButton } from "~/Components/Buttons/UploadButton";
import DeleteButton from "~/Components/Buttons/DeleteButton";
import { EditButton } from "~/Components/Buttons/EditButton";
import PublishedButton from "~/Components/Buttons/PublishedButton";

const Dashboard: NextPage = () => {
  const { data: sessionData } = useSession();

  const userId = sessionData?.user.id;
  const { data, isLoading, error, refetch } =
    api.user.getDashboardData.useQuery(userId as string);

  interface StatsItem {
    name: string;
    stat: string;
    icon: (className: string) => JSX.Element;
  }

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (error || !data) {
      return (
        <ErrorMessage
          icon="Users"
          message="Error loading channel"
          description="Sorry there is an error at this time."
        />
      );
    } else {
      return <></>;
    }
  };

  const stats: StatsItem[] = [
    {
      name: "Total Views",
      stat: data?.totalViews?.toString() || "0",
      icon: (className) => <Eye className={className} />,
    },
    {
      name: "Total followers",
      stat: data?.totalFollowers?.toString() || "0",
      icon: (className) => <UserCheck className={className} />,
    },
    {
      name: "Total likes",
      stat: data?.totalLikes?.toString() || "0",
      icon: (className) => <Heart className={className} />,
    },
  ];

  return (
    <>
      <Head>
        <title>Creator Studio-Krysonix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout closeSidebar={true}>
        <>
          {!data ? (
            <Error />
          ) : (
            <div className="flex flex-col gap-8 ">
              <div className="md:flex md:items-center md:justify-between md:space-x-5">
                <div className="flex items-start space-x-5">
                  <div className="pt-1.5">
                    <h1 className="text-2xl font-bold text-gray-200">
                      <span>Welcome Back </span> {sessionData?.user.name}
                    </h1>
                    <p className="text-sm text-gray-400">
                      Track and manage your channel and videos
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
                  <UploadButton refetch={refetch} />
                </div>
              </div>
              <div>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {stats.map((item) => (
                    <Card key={item.name} className="bg-gray-950 text-gray-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                          {item.name}
                        </CardTitle>
                        {item.icon("h-4 w-4 text-gray-400")}
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-700">
                          {item.stat}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </dl>
              </div>

              <Card className="bg-gray-950 text-gray-200">
                <CardHeader>
                  <CardTitle>Your Videos</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage and track your uploaded content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="no-scrollbar  w-full ">
                    <Table className=" no-scrollbar">
                      <TableHeader>
                        <TableRow className="hover:bg-gray-950">
                          <TableHead className="w-[100px]">Status</TableHead>
                          <TableHead>Video</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.videos.map((video) => (
                          <TableRow
                            key={video.id}
                            className="hover:bg-gray-950"
                          >
                            <TableCell>
                              <PublishedButton video={video} />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-4">
                                <div className="h-[90px] w-[160px] flex-shrink-0">
                                  <Thumbnail
                                    thumbnailUrl={video.thumbnailUrl || ""}
                                    width={160}
                                    height={90}
                                  />
                                </div>
                                <div className="w-full">
                                  <p className="font-medium text-gray-200">
                                    {video.title}
                                  </p>
                                  <p className="line-clamp-1 text-sm text-gray-400">
                                    {video.description}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-green-900 text-green-200 hover:bg-green-800"
                                >
                                  {video.likes} Likes
                                </Badge>
                                <Badge
                                  variant="destructive"
                                  className="bg-red-900 text-red-200"
                                >
                                  {video.dislikes} Dislikes
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              {video.createdAt.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end  space-x-2">
                                <DeleteButton
                                  videoId={video.id}
                                  refetch={refetch}
                                />
                                <EditButton
                                  video={{
                                    videoUrl: video.videoUrl as string,
                                    id: video.id,
                                    title: video.title || "",
                                    description: video.description || "",
                                    thumbnailUrl: video.thumbnailUrl || "",
                                  }}
                                  refetch={refetch}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      </Layout>
    </>
  );
};

export default Dashboard;
