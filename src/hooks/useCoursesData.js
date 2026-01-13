// src/hooks/useCoursesData.js
import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { courses as staticCourses } from "../data/courses";

// Lê cursos do Firestore, com seed automático a partir do courses.js
export function useCoursesData() {
  const [courses, setCourses] = useState(staticCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const seededRef = useRef(false);

  useEffect(() => {
    const colRef = collection(db, "courses");

    const unsub = onSnapshot(
      colRef,
      async (snapshot) => {
        try {
          // Se ainda não existir nada na coleção, faz seed uma única vez
          if (snapshot.empty) {
            if (!seededRef.current) {
              seededRef.current = true;

              await Promise.all(
                staticCourses.map((course) =>
                  setDoc(
                    doc(db, "courses", course.slug),
                    { ...course },
                    { merge: true }
                  )
                )
              );

              // Após o seed, o Firestore deve disparar novo snapshot
              return;
            }

            // fallback (caso algo dê errado e continue vazio)
            setCourses(staticCourses);
            setLoading(false);
            return;
          }

          const fromDb = snapshot.docs.map((d) => ({
            slug: d.id,
            ...d.data(),
          }));

          // Firestore sobrescreve o que vier do arquivo estático (fallback)
          const map = new Map();
          staticCourses.forEach((c) => map.set(c.slug, c));

          fromDb.forEach((c) => {
            const base = map.get(c.slug) || {};
            map.set(c.slug, { ...base, ...c });
          });

          setCourses(Array.from(map.values()));
          setLoading(false);
        } catch (err) {
          console.error("Erro em useCoursesData:", err);
          setError(err);
          setCourses(staticCourses);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Erro ao ouvir coleção courses:", err);
        setError(err);
        setCourses(staticCourses);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { courses, loading, error };
}
