import React from 'react';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { IndiaMap } from '../components/IndiaMap';
import { LiveStats } from '../components/LiveStats';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="relative">
        {/* Hero Section with original dot grid background */}
        <Hero />
      </div>
    </Layout>
  );
};
