import MainSlider from "@/components/main/main.slider";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";

export default async function HomePage() {

  const res = await sendRequest<IBackendRes<ITrackTop[]>>(
    {
      url: 'http://localhost:8000/api/v1/tracks/top',
      method: 'POST',
      body: {
        category: "CHILL",
        limit: 2
      }
    }
  );

  // console.log(" checkdata", res?.data[1]?.title);
  return (
    <div>
      <Container>
        <MainSlider />
      </Container>


    </div>

  );
}
