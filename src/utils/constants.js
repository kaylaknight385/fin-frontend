import novaGif from '../assets/nova.gal.gif';
import bloomGif from '../assets/bloom-bg.gif';
import pixelGif from '../assets/pixel-bg.gif';
import novaCursor from '../assets/sym455.cur';
import bloomCursor from '../assets/nat793.cur';
import pixelCursor from '../assets/mec440.cur';

export const CATEGORIES = [
    {value: 'food', label: 'Food'},
    {value: 'entertainment', label: 'Entertainment'},
    {value: 'shopping', label: 'Shopping'},
    {value: 'bills', label: 'Bills'},
    {value: 'transport', label: 'Transport'},
    {value: 'gaming', label: 'Gaming'},
    {value: 'beauty', label: 'Beauty'},
    {value: 'streaming', label: 'Streaming'},
    {value: 'travel', label: 'Savings'},
    {value: 'events', label: 'Events'},
    {value: 'savings', label: 'Savings'},
    {value: 'other', label: 'Other'}
];

export const THEMES = [
    {
        id: 'cosmic',
        name: 'NOVA',
        agent: 'Nova',
        description: 'Save money in the stars! This theme holds the galaxy with starry skies, floating planets, and deep space vibes perfect for dreamers.',
        gradient: 'from-indigo-950 via-purple-900 to-blue-950',
        background: novaGif,
        font: 'font-mercy-christole',
        cursor: novaCursor
    }, 
    {
        id: 'garden',
        name: 'BLOOM',
        agent: 'Bloom',
        description: 'Plant the seed for money growth! This theme holds earthy vibes, leafy greens, and cozy nature-inspired aesthetics that feel like a breath of fresh air for your money.',
        gradient: 'from-green-600 to-brown-600',
        background: bloomGif,
        font: 'font-melt-swashes',
        cursor: bloomCursor
    },
    {
        id:'neon',
        name: 'PIXEL',
        agent: 'Pixel',
        description: 'Level up your funds with retro 8bit graphics, glowing arcade lights, and gamer energy that pops off the screen.',
        gradient: 'from-purple-600 to-pink-600',
        background: pixelGif,
        font: 'font-04b',
        cursor: pixelCursor
    }
];