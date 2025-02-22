"use client";
import Container from "@/components/container";
import Marquee from "@/components/ui/marquee";
import { SectionBadge } from "@/components/ui/section-bade";
import { REVIEWS } from "@/lib/reviews";
import Image from "next/image";

const firstRow = REVIEWS.slice(0, REVIEWS.length / 2);
const secondRow = REVIEWS.slice(REVIEWS.length / 2);

const Reviews = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-12 md:py-16 lg:py-24">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <SectionBadge title="Our Customers" />
          <h2 className="font-heading mt-6 text-2xl font-medium !leading-snug md:text-4xl lg:text-5xl">
            What our customers say
          </h2>
          <p className="text-accent-foreground/80 mt-6 text-center text-base md:text-lg">
            We are proud to have helped thousands of customers across the globe.
            Here are some of their stories
          </p>
        </div>
      </Container>
      <Container>
        <div className="relative mt-16 w-full overflow-hidden">
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:30s]">
              {firstRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee pauseOnHover reverse className="[--duration:30s]">
              {secondRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
            <div className="bg-primary/80 absolute left-1/4 top-1/4 -z-10 hidden h-28 w-28 rounded-full blur-[6rem] lg:block"></div>
            <div className="bg-primary/80 absolute right-1/4 top-1/4 -z-10 hidden h-28 w-28 rounded-full blur-[6rem] lg:block"></div>
          </div>
        </div>
      </Container>
    </div>
  );
};

const ReviewCard = ({
  img,
  name,
  username,
  review,
}: {
  img: string;
  name: string;
  username: string;
  review: string;
}) => {
  return (
    <figure className="border-foreground/5 hover:bg-foreground/10 relative w-64 cursor-pointer overflow-hidden rounded-xl border bg-neutral-50/[.05] p-4 transition-all duration-300 ease-in-out">
      <div className="flex flex-row items-center gap-2">
        <Image
          className="rounded-full"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-foreground text-sm font-medium">
            {name}
          </figcaption>
          <p className="text-foreground/40 text-xs font-medium">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{review}</blockquote>
    </figure>
  );
};

export default Reviews;
