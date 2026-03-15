"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { HeartIcon, ShareIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

export default function QuoteSwiper() {
	const [quotes, setQuotes] = useState<Verse[]>([]);
	const [books, setBooks] = useState<any[]>([]);
	const [bible, setBible] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const swiperRef = useRef<any>(null);

	const translation = "eng_kjv";

	useEffect(() => {
		loadBooks();
	}, []);
	
	type Verse = {
		text: string;
		bible_version: string;
		reference: string;
	};
	
	async function loadBooks() {
		try {
			const res = await fetch(`https://bible.helloao.org/api/${translation}/books.json`);
			const data = await res.json();
			setBooks(data.books);
			setBible(data.translation.englishName);
			await fetchRandomVerse(data.books, data.translation.englishName);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	async function fetchRandomVerse(bookList:any[], bible_translation: string) {
		setLoading(true);
		if (!bookList || bookList.length === 0) return;

		const book = bookList[Math.floor(Math.random() * bookList.length)];
		const chapter = Math.floor(Math.random() * book.numberOfChapters) + 1;

		const res = await fetch(`https://bible.helloao.org/api/${translation}/${book.id}/${chapter}.json`);
		const data = await res.json();
		const verses = data.chapter?.content;
		if (!verses || verses.length === 0) return await fetchRandomVerse(bookList, bible_translation);
		const verse = verses[Math.floor(Math.random() * verses.length)];
		
		function flattenContent(content:any[]) {
			return content
			.map((c) => {
				if (typeof c === "string") return c; // plain string
				if (c.lineBreak) return "\n";        // line break
				if (c.text) return c.text;           // text from object like { text: "...", wordsOfJesus: true }
				return "";                           // fallback
			})
			.join("");
		}
		
		const newQuote = {
			text: flattenContent(verse.content),
			bible_version: `${bible_translation}`,
			reference: `${book.name} ${chapter}:${verse.number}`,
		};

		setQuotes(newQuote);
		setTimeout(() => swiperRef.current?.slideNext(), 50);
	}

	if (loading)
    return (
		<div className="h-[420px] flex items-center justify-center text-gray-700 text-lg">
			Loading Bible verse...
		</div>
    );

	return (
		<div className="w-full max-w-sm mx-auto p-4">
			<button onClick={() => loadBooks()} className="w-full py-3 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition shadow-sm mb-6">
				Next Verse →
			</button>
			
			<Swiper slidesPerView={1} onSwiper={(swiper) => (swiperRef.current = swiper)}>
				{quotes && (
					<SwiperSlide>
						<AnimatePresence mode="wait">
							<motion.div
								key={quotes.reference}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.5 }}
							>
								<div className="max-h-[420px] overflow-y-auto rounded-md p-6 flex flex-col justify-between bg-white border border-gray-200">
									<p className="text-lg sm:text-xl leading-relaxed text-gray-900">
										{quotes.text}
									</p>
									<p className="mt-4 text-sm text-gray-500 text-right">
										<small className="font-semibold">{quotes.bible_version}</small>
										<br/>
										{quotes.reference}
									</p>
								</div>
							</motion.div>
						</AnimatePresence>
					</SwiperSlide>
				)}
			</Swiper>
		</div>
	);
}