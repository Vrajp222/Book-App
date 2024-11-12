import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

export default function BookDetail({ route, navigation }) {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookRef = doc(firestore, 'books', bookId);
        const docSnap = await getDoc(bookRef);
        if (docSnap.exists()) {
          setBook(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching book: ", error);
      }
    };

    const fetchBorrowedBooks = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, 'borrowedBooks'));
        setBorrowedBooks(snapshot.docs.map(doc => doc.id));
      } catch (error) {
        console.error("Error fetching borrowed books: ", error);
      }
    };

    fetchBook();
    fetchBorrowedBooks();
  }, [bookId]);

  const handleBorrowBook = async () => {
    if (borrowedBooks.length >= 3) {
      Alert.alert('Limit reached', 'You cannot borrow more than three books.');
    } else {
      await setDoc(doc(firestore, 'borrowedBooks', bookId), { bookId });
      Alert.alert('Book borrowed successfully');
      navigation.navigate('Borrowed');
    }
  };

  if (!book) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.name}</Text>
      <Text style={styles.author}>by {book.author}</Text>
      <Text style={styles.rating}>Rating: {book.rating}</Text>
      <Text style={styles.summary}>Summary: {book.summary}</Text>
      
      <TouchableOpacity style={styles.borrowButton} onPress={handleBorrowBook}>
        <Text style={styles.borrowButtonText}>Borrow Book</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    color: '#555',
    marginBottom: 15,
  },
  rating: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  summary: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  borrowButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  borrowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
