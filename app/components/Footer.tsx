import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPinterest, FaLeaf } from 'react-icons/fa';
import { RiCustomerService2Fill, RiSeedlingLine } from 'react-icons/ri';
import { IoMdMail, IoMdWater } from 'react-icons/io';
import { BsTelephoneFill, BsSun, BsTree, BsFlower1 } from 'react-icons/bs';
import { HiLocationMarker, HiOutlineHeart } from 'react-icons/hi';
import { GiFarmer, GiWheat } from 'react-icons/gi';
import { TbLeaf, TbPlant2 } from 'react-icons/tb';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-b from-green-900 to-green-950 text-white mt-auto">
      {/* Organic Certification Badge */}
      <div className="bg-amber-600 py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-2 md:space-x-6 text-sm md:text-base">
            <span className="flex items-center"><TbPlant2 className="mr-1" /> 100% Organic</span>
            <span className="flex items-center"><TbLeaf className="mr-1" /> No Pesticides</span>
            <span className="flex items-center"><BsSun className="mr-1" /> Naturally Grown</span>
            <span className="hidden md:flex items-center"><GiFarmer className="mr-1" /> Direct from Farmers</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaLeaf className="text-amber-400 text-3xl" />
              <h3 className="text-2xl font-bold text-amber-400">Khati Chai</h3>
            </div>
            <p className="text-green-200 leading-relaxed">
              Bringing nature's finest organic produce directly from Bangladesh's farms to your table. 
              Pure, natural, and chemical-free since 2015.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-green-800 hover:bg-amber-500 p-3 rounded-full transition duration-300 border border-green-700">
                <FaFacebookF className="text-sm" />
              </a>
              <a href="#" className="bg-green-800 hover:bg-amber-500 p-3 rounded-full transition duration-300 border border-green-700">
                <FaTwitter className="text-sm" />
              </a>
              <a href="#" className="bg-green-800 hover:bg-amber-500 p-3 rounded-full transition duration-300 border border-green-700">
                <FaInstagram className="text-sm" />
              </a>
              <a href="#" className="bg-green-800 hover:bg-amber-500 p-3 rounded-full transition duration-300 border border-green-700">
                <FaPinterest className="text-sm" />
              </a>
            </div>
            {/* Trust Badge */}
            <div className="bg-green-800 p-3 rounded-lg border border-green-700 inline-block">
              <span className="text-amber-400 font-semibold flex items-center">
                <BsFlower1 className="mr-2" /> Certified Organic
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <TbLeaf className="text-amber-400 mr-2" /> Quick Links
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300 flex items-center"><TbLeaf className="mr-2 text-xs" /> Home</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300 flex items-center"><TbLeaf className="mr-2 text-xs" /> Shop Organic</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300 flex items-center"><TbLeaf className="mr-2 text-xs" /> Our Farms</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300 flex items-center"><TbLeaf className="mr-2 text-xs" /> About Us</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300 flex items-center"><TbLeaf className="mr-2 text-xs" /> Contact Us</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300 flex items-center"><TbLeaf className="mr-2 text-xs" /> FAQ</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300 flex items-center"><TbLeaf className="mr-2 text-xs" /> Shipping Policy</a></li>
            </ul>
          </div>

          {/* Organic Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <GiWheat className="text-amber-400 mr-2" /> Our Products
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300">Fresh Vegetables</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300">Organic Fruits</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300">Chemical-free Rice</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300">Organic Lentils</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300">Pure Honey</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300">Herbal Spices</a></li>
              <li><a href="#" className="text-green-200 hover:text-amber-400 transition duration-300">Cold-pressed Oils</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <HiOutlineHeart className="text-amber-400 mr-2" /> Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-green-800 p-2 rounded-full mr-3 border border-green-700">
                  <HiLocationMarker className="text-amber-400" />
                </div>
                <span className="text-green-200">Organic Market Complex, Farmgate, Dhaka-1215, Bangladesh</span>
              </li>
              <li className="flex items-center">
                <div className="bg-green-800 p-2 rounded-full mr-3 border border-green-700">
                  <BsTelephoneFill className="text-amber-400 text-sm" />
                </div>
                <span className="text-green-200">+880 1712-345678</span>
              </li>
              <li className="flex items-center">
                <div className="bg-green-800 p-2 rounded-full mr-3 border border-green-700">
                  <IoMdMail className="text-amber-400" />
                </div>
                <span className="text-green-200">hello@khati-chai.com</span>
              </li>
              <li className="flex items-center">
                <div className="bg-green-800 p-2 rounded-full mr-3 border border-green-700">
                  <RiCustomerService2Fill className="text-amber-400" />
                </div>
                <span className="text-green-200">Farmer Support: 24/7</span>
              </li>
            </ul>
            
            {/* Farm Fresh Badge */}
            <div className="mt-6 bg-amber-500/20 p-3 rounded-lg border border-amber-500/30">
              <p className="text-sm flex items-center text-amber-300">
                <BsTree className="mr-2" /> 
                Fresh from farm to home within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Certifications */}
      <div className="border-t border-green-800 bg-green-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-400 text-sm mb-4 md:mb-0 flex items-center">
              <FaLeaf className="mr-2" /> 
              © {currentYear} Khati chai Organic. All rights reserved. | Naturally Yours
            </p>
            
            {/* Certifications */}
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-xs bg-green-800 px-3 py-1 rounded-full text-amber-300">USDA Organic</span>
              <span className="text-xs bg-green-800 px-3 py-1 rounded-full text-amber-300">EU Organic</span>
              <span className="text-xs bg-green-800 px-3 py-1 rounded-full text-amber-300">Non-GMO</span>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center">
              <span className="text-green-400 mr-3 text-sm flex items-center">
                <IoMdWater className="mr-1" /> We accept:
              </span>
              <div className="flex space-x-2">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-green-800">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-green-800">MasterCard</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-green-800">bKash</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-green-800">Nagad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}