// src/pages/AboutUs.jsx
import React from "react";
import Navbar from "../components/Navbar";

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          About Us
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Welcome to our recipe hub – your go-to place for delicious
          inspiration.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">
            Who We Are
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We are a passionate team of food lovers, home chefs, and culinary
            enthusiasts dedicated to making cooking simple and enjoyable for
            everyone. Our goal is to create a trusted space where people can
            share their favorite recipes, learn new cooking techniques, and
            explore flavors from around the world.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">
            What We Offer
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our platform is built to help you find recipes easily, organize your
            favorite dishes, and get inspired to try new meals. Whether you're a
            beginner or an experienced chef, we’re here to make your cooking
            journey more exciting and stress-free.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We aim to bring together a global community of food lovers who
            believe in sharing knowledge, creativity, and love through cooking.
            Every recipe has a story, and we’re here to celebrate those stories.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
