'use client';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from "next/link";
import { convertToSlug } from "@/utils/api";
import Image from "next/image";
interface IPrpops {
    tracks: ITrackTop[],
    title: string
}
const MainSlider = (props: IPrpops) => {

    const NextArrow = (props: any) => {
        return (
            <Button variant="outlined" vocab="contained"
                onClick={props.onClick}
                sx={{
                    position: "absolute",
                    right: 0,
                    top: "25%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronRightIcon />
            </Button>
        )
    }

    const PrevArrow = (props: any) => {
        return (
            <Button variant="outlined" vocab="contained"
                onClick={props.onClick}
                sx={{
                    position: "absolute",
                    top: "25%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronLeftIcon />
            </Button>
        )
    }


    const settings: Settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]

    };
    return (

        <Box
            sx={{
                margin: "0 50px",
                ".track": {
                    padding: "0 10px",

                    "img": {
                        borderRadius: "5px",
                        objectFit: "cover",
                        height: "150px",
                        width: "100%",
                    }
                },
                "h3": {
                    border: "1px solid #ccc",
                    padding: "20px",
                    height: "200px",

                }
            }}
        >
            <h2> {props.title} </h2>

            <Slider {...settings}>
                {props.tracks.map((track, index) => (
                    <div className="track" key={track._id}>
                        <div style={{
                            position: "relative",
                            height: "150px",
                            width: "100%"
                        }}
                        >
                            <Image
                                alt="eric image"
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                fill
                                style={{
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                        <Link
                            href={`/track/${convertToSlug(track.title)}-${track._id}.html?audio=${track.trackUrl}`}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                            {track.title}
                        </Link>

                        <h5 >{track.description}</h5>
                    </div>
                ))}

            </Slider>
            <Divider />
        </Box>

    );
}

export default MainSlider;
