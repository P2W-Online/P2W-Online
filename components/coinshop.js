import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, orderBy, limit, query } from 'firebase/firestore';
import { firebase_db } from '../firebase/firebase';

