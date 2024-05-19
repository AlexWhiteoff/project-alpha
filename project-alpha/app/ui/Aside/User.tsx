import React from "react";

export default function UserProfile() {
    return (
        <div className="flex flex-row items-center gap-3">
            <div>
                <div className="w-[40px] h-[40px] bg-gray-300 rounded-full"></div>
            </div>
            <div>
                <div className="block text-gray-100 text-lg">John Smith</div>
            </div>
        </div>
    );
}
