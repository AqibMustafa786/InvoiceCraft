
'use client';

import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
  Timestamp,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  // Firestore's native `serverTimestamp()` can only be used with `setDoc` and `updateDoc`.
  // When used, it must be the value of a field, not part of a larger object.
  // We need to ensure that the fields intended to be timestamps are correctly formatted.

  // A helper function to prepare data for Firestore, converting Date objects to Timestamps
  // and ensuring serverTimestamp is used correctly.
  const prepareDataForFirestore = (obj: any): any => {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value instanceof Date) {
          newObj[key] = Timestamp.fromDate(value);
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          // This is a rough check for serverTimestamp sentinel, which is an object.
          // In a real app, you might have a more specific check if needed.
          if (value.constructor.name === 'FieldValue') {
            newObj[key] = value;
          } else {
            newObj[key] = prepareDataForFirestore(value);
          }
        }
        else {
          newObj[key] = value;
        }
      }
    }
    return newObj;
  };

  const preparedData = prepareDataForFirestore(data);

  // Ensure userId is preserved, as it's crucial for security rules.
  if (data.userId && !preparedData.userId) {
    preparedData.userId = data.userId;
  }

  setDoc(docRef, preparedData, options).catch(error => {
    console.error("Firestore setDoc error:", error);
    try {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: options.merge ? 'update' : 'create',
          requestResourceData: data,
        })
      )
    } catch (innerError) {
      console.error("Error emitting permission-error:", innerError);
    }
  })
}


/**
 * Initiates an addDoc operation for a collection reference.
 * Does NOT await the write operation internally.
 * Returns the Promise for the new doc ref, but typically not awaited by caller.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  const promise = addDoc(colRef, data)
    .catch(error => {
      console.error("Firestore addDoc error:", error);
      try {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: colRef.path,
            operation: 'create',
            requestResourceData: data,
          })
        )
      } catch (innerError) {
        console.error("Error emitting permission-error:", innerError);
      }
    });
  return promise;
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  updateDoc(docRef, data)
    .catch(error => {
      console.error("Firestore updateDoc error:", error);
      try {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: data,
          })
        )
      } catch (innerError) {
        console.error("Error emitting permission-error:", innerError);
      }
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef)
    .catch(error => {
      console.error("Firestore deleteDoc error:", error);
      try {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
          })
        )
      } catch (innerError) {
        console.error("Error emitting permission-error:", innerError);
      }
    });
}


