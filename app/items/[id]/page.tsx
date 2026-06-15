"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { packagesAPI, Package } from "@/lib/api/packages";
import { bookingsAPI } from "@/lib/api/bookings";
import Button from "@/components/ui/Button";
import {
  FaSpinner,
  FaCalendar,
  FaUsers,
  FaTag,
  FaArrowLeft,
  FaStar,
} from "react-icons/fa";
import toast from "react-hot-toast";
// import Cookies from "js-cookie";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [packageItem, setPackageItem] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    date: "",
    guests: 1,
  });
  const [isBooking, setIsBooking] = useState(false);
  const [relatedPackages, setRelatedPackages] = useState<Package[]>([]);

  // Fetch package details
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const data = await packagesAPI.getById(id as string);
        console.log("Fetched package data:", data); // DEBUG: See what data is returned
        console.log("Package ID:", data?.id); // DEBUG: Check if ID exists
        setPackageItem(data);

        // Fetch related packages (same category)
        const allPackages = await packagesAPI.getAll({
          category: data.category,
          limit: 3,
        });
        const related = allPackages.data.filter((pkg) => pkg.id !== data.id);
        setRelatedPackages(related.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch package:", error);
        toast.error("Package not found");
        router.push("/items");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackageDetails();
    }
  }, [id, router]);

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // If empty string, set to 1 (default), otherwise parse to int
    const guestsValue = value === "" ? 1 : parseInt(value);
    // Ensure it's a valid number and within limits
    const validGuests = isNaN(guestsValue)
      ? 1
      : Math.min(Math.max(guestsValue, 1), packageItem?.capacity || 10);
    setBooking({ ...booking, guests: validGuests });
  };

const handleBooking = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!user) {
    toast.error('Please login to book this package');
    router.push('/login');
    return;
  }
  
  if (!booking.date) {
    toast.error('Please select a date');
    return;
  }
  
  // CRITICAL: Check if packageItem exists
  if (!packageItem) {
    console.error('Package item is null/undefined');
    toast.error('Package data not loaded. Please refresh the page.');
    return;
  }
  
  if (!packageItem.id) {
    console.error('Package ID is missing:', packageItem);
    toast.error('Invalid package data. Please try again.');
    return;
  }
  
  const validGuests = booking.guests && !isNaN(booking.guests) ? booking.guests : 1;
  
  // Log the package ID being booked
  console.log('Booking package with ID:', packageItem.id);
  console.log('Package title:', packageItem.title);
  console.log('Full package item:', packageItem);
  
  const bookingData = {
    packageId: Number(packageItem.id),
    date: booking.date,
    guests: Number(validGuests)
  };
  
  console.log('========== BOOKING DEBUG ==========');
  console.log('1. Booking Data:', bookingData);
  
  setIsBooking(true);
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/v1/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Booking failed');
    }
    
    toast.success('Booking created successfully!');
    setBooking({ date: '', guests: 1 });
  } catch (error: any) {
    console.error('Booking error:', error);
    toast.error(error.message || 'Booking failed');
  } finally {
    setIsBooking(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <FaSpinner className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!packageItem) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-xl text-gray-600 mb-4">Package not found</p>
        <Link href="/items">
          <Button variant="primary">Back to Packages</Button>
        </Link>
      </div>
    );
  }

  // Ensure guests has a valid number for display
  const displayGuests =
    booking.guests && !isNaN(booking.guests) ? booking.guests : 1;
  const totalPrice = packageItem.price * displayGuests;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Packages</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Package Details */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-6 bg-gray-200">
              {packageItem.image ? (
                <Image
                  src={packageItem.image}
                  alt={`Image of ${packageItem.title} - Riverside Retreat package`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              {packageItem.isFeatured && (
                <span className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-semibold z-10">
                  Featured
                </span>
              )}
            </div>

            {/* Title and Price */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {packageItem.title}
                </h1>
                <span className="text-3xl font-bold text-blue-600">
                  ${packageItem.price}
                </span>
              </div>

              <p className="text-gray-600 text-lg mb-4">
                {packageItem.shortDesc}
              </p>

              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold capitalize">
                    {packageItem.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-semibold">{packageItem.capacity} guests</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price per night</p>
                  <p className="font-semibold">${packageItem.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {packageItem.description}
              </p>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Book This Package
              </h3>

              <form onSubmit={handleBooking}>
                {/* Date Picker */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <div className="relative">
                    <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={booking.date}
                      onChange={(e) =>
                        setBooking({ ...booking, date: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Guests - Fixed */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={displayGuests}
                      onChange={handleGuestsChange}
                      min={1}
                      max={packageItem.capacity}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum capacity: {packageItem.capacity} guests
                  </p>
                </div>

                {/* Price Summary - Fixed */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Price per night</span>
                    <span className="font-semibold">${packageItem.price}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Guests</span>
                    <span className="font-semibold">{displayGuests}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900">
                        Total per night
                      </span>
                      <span className="font-bold text-blue-600">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin inline mr-2" />
                      Booking...
                    </>
                  ) : (
                    "Book Now"
                  )}
                </Button>

                {!user && (
                  <p className="text-sm text-gray-500 text-center mt-4">
                    Please login to book this package
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Related Packages Section */}
        {relatedPackages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPackages.map((relatedPkg) => (
                <Link key={relatedPkg.id} href={`/items/${relatedPkg.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="relative h-48 w-full bg-gray-200">
                      {relatedPkg.image ? (
                        <Image
                          src={relatedPkg.image}
                          alt={`Image of ${relatedPkg.title} - Related riverside package`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <span className="text-gray-400 text-sm">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {relatedPkg.title}
                      </h3>
                      <p className="text-blue-600 font-bold">
                        ${relatedPkg.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}