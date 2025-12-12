"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messageData from "@/app/lib/message.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  // defensive: ensure messageData is an array
  const messages = Array.isArray(messageData) ? messageData : [];

  return (
    <>
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12" aria-labelledby="home-title">
          <h1 id="home-title" className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback — where your identity remains a secret.
          </p>
        </section>

        <div className="w-full max-w-lg md:max-w-xl" aria-roledescription="carousel">
          <Carousel plugins={[Autoplay({ delay: 2000 })]}>
            <CarouselContent>
              {messages.length > 0 ? (
                messages.map((m, index) => (
                  <CarouselItem key={m.id ?? index} className="p-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>{m.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                        <Mail className="shrink-0" aria-hidden />
                        <div>
                          <p>{m.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {m.received}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>No messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">No messages available right now.</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              )}
            </CarouselContent>
          </Carousel>
        </div>
      </main>

      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © {new Date().getFullYear()} True Feedback. All rights reserved.
      </footer>
    </>
  );
}
