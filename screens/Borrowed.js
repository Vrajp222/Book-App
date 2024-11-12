import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase';
import { collection, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';

export default function Borrowed() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const borrowedBooksSnapshot = await getDocs(collection(firestore, 'borrowedBooks'));
        const booksList = await Promise.all(
          borrowedBooksSnapshot.docs.map(async (borrowedDoc) => {
            const bookId = borrowedDoc.id;
            const bookDoc = await getDoc(doc(firestore, 'books', bookId));
            if (bookDoc.exists()) {
              return { id: bookId, ...bookDoc.data() };
            }
            return null;
          })
        );

        setBorrowedBooks(booksList.filter(book => book !== null));
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const handleReturnBook = async (bookId, bookName) => {
    try {
      await deleteDoc(doc(firestore, 'borrowedBooks', bookId));
      Alert.alert("Success", `Book "${bookName}" returned successfully.`);
      setBorrowedBooks(borrowedBooks.filter(book => book.id !== bookId));
    } catch (error) {
      console.error("Error returning book:", error);
      Alert.alert("Error", "Failed to return the book.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Borrowed Books</Text>
      <FlatList
        data={borrowedBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.bookName}>{item.name}</Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
            <TouchableOpacity 
              style={styles.returnButton} 
              onPress={() => handleReturnBook(item.id, item.name)}>
              <Text style={styles.returnButtonText}>Return Book</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  returnButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
