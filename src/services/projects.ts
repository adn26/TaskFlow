'use server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Project } from '@/lib/types';

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  const docRef = await addDoc(collection(db, 'projects'), project);
  return { id: docRef.id, ...project };
}

export async function getProjects(): Promise<Project[]> {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Project));
    return projects;
}

export async function getProject(id: string): Promise<Project | null> {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Project;
    } else {
        return null;
    }
}
