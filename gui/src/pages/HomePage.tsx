import React, { FC } from "react";
import HomePageHeader from "../components/HomePageHeader";
import MainContent from "../components/MainContent";
import Content from "../paperbase/Content";

const HomePage: FC = () => {
  return <React.Fragment>
    <HomePageHeader />
    <MainContent>
      <Content />
    </MainContent>
  </React.Fragment>;
};


export default HomePage;