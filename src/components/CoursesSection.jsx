// src/components/CoursesSection.jsx
import React from "react";
import CourseCard from "./CourseCard";
import { useCoursesData } from "../hooks/useCoursesData";

const CoursesSection = () => {
  const { courses, loading } = useCoursesData();

  return (
    <section id="cursos" className="py-16 md:py-20 bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-10 md:mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Cursos focados em{" "}
            <span className="text-accent-green">resultado real</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-300">
            Cada curso foi pensado para levar você do básico ao avançado com
            prática guiada, exemplos reais e suporte próximo do professor
            Ricardo Lins.
          </p>
          <p className="mt-2 text-[11px] md:text-xs text-slate-500">
            Deslize para o lado para ver todos os cursos no celular.
          </p>
        </header>

        {loading ? (
          <div className="text-sm text-slate-400">Carregando cursos…</div>
        ) : (
          <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-2 md:pb-0">
            {courses.map((course) => (
              <CourseCard
                key={course.slug}
                title={course.title}
                description={course.shortDescription}
                level={course.level}
                duration={course.duration}
                highlight={!!course.highlight}
                nextClass={course.nextClass}
                slug={course.slug}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;
