import { authOptions } from "@/app/api/auth/auth.options";
import MainSlider from "@/components/main/main.slider";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth/next";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  console.log(session);

  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: { category: "CHILL", limit: 10 }
  });

  const workout = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: { category: "WORKOUT", limit: 10 }
  });

  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: { category: "PARTY", limit: 10 }
  });


  // console.log(" checkdata", res?.data[1]?.title);
  return (
    <div>
      <Container>
        <MainSlider tracks={chills?.data ?? []} title={"Top Chill"} />
        <MainSlider tracks={workout?.data ?? []} title={"Top Workout"} />
        <MainSlider tracks={party?.data ?? []} title={"Top Party"} />
      </Container>


    </div>

  );
}
