"use client";

import { useEffect } from "react";

import { TimelineProp } from "@/app/types/timeline-prop";

import "./title.scss";

type TitleProps = {
  timeline?: TimelineProp;
};

export default function Title({timeline}: TitleProps) {
    return (
      <div className="title">
        Title
      </div>
    );
}