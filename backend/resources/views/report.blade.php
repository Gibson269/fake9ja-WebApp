@extends('layouts.app')

@section('title', 'Report Counterfeit Product (100% Free) | Fake9ja')

@section('content')
<div class="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto" x-data="reportWizard()">
    <!-- Top Header -->
    <div class="text-center mb-10 space-y-3">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Free Public Citizen Intelligence &bull; Zero Fees
        </div>
        <h1 class="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Log a Counterfeit Product
        </h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Help protect fellow Nigerians. Document suspected fake medicines, foods, cosmetics, or substandard goods in 5 quick steps.
        </p>
    </div>

    <!-- Step Progress Indicator -->
    <div class="mb-10">
        <div class="flex items-center justify-between relative">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-0"></div>
            <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-300 -z-0"
                 :style="'width: ' + ((step - 1) / 4 * 100) + '%'"></div>

            <template x-for="(s, index) in steps" :key="index">
                <div class="relative z-10 flex flex-col items-center">
                    <button type="button" @click="if (index + 1 < step) step = index + 1"
                            class="w-10 h-10 rounded-2xl flex items-center justify-center font-heading font-bold text-sm transition-all duration-300 shadow-sm"
                            :class="step === index + 1 
                                ? 'bg-emerald-600 text-white shadow-emerald-500/30 ring-4 ring-emerald-500/20 scale-110' 
                                : (step > index + 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400')">
                        <template x-if="step > index + 1">
                            <i data-lucide="check" class="w-4 h-4"></i>
                        </template>
                        <template x-if="step <= index + 1">
                            <span x-text="index + 1"></span>
                        </template>
                    </button>
                    <span class="text-[11px] font-medium mt-2 hidden sm:block" 
                          :class="step === index + 1 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'"
                          x-text="s"></span>
                </div>
            </template>
        </div>
    </div>

    <!-- Main Wizard Form -->
    <form action="{{ route('report.store') }}" method="POST" enctype="multipart/form-data" class="glass-panel p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800">
        @csrf

        <!-- STEP 1: Product Basics -->
        <div x-show="step === 1" class="space-y-6">
            <div>
                <h2 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-1">Step 1: Product Information</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">Tell us about the item you purchased or observed.</p>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Product Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" name="name" x-model="formData.name" required
                           placeholder="e.g. Lonart DS Tablets, Eva Table Water, Toyota Oil Filter"
                           class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            Brand / Purported Manufacturer
                        </label>
                        <input type="text" name="brand" x-model="formData.brand"
                               placeholder="e.g. Bliss GVS, Unilever, Dangote"
                               class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            Category <span class="text-red-500">*</span>
                        </label>
                        <select name="category" x-model="formData.category" required
                                class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            <option value="">Select Category</option>
                            <option value="Pharmaceuticals & Drugs">Pharmaceuticals & Drugs</option>
                            <option value="Baby Formula & Nutrition">Baby Formula & Nutrition</option>
                            <option value="Cosmetics & Skincare">Cosmetics & Skincare</option>
                            <option value="Packaged Foods & Drinks">Packaged Foods & Drinks</option>
                            <option value="Electronics & Cables">Electronics & Cables</option>
                            <option value="Auto Parts & Brake Pads">Auto Parts & Brake Pads</option>
                            <option value="Spirits & Alcoholic Drinks">Spirits & Alcoholic Drinks</option>
                            <option value="Building Materials">Building Materials</option>
                            <option value="Agricultural Inputs">Agricultural Inputs</option>
                            <option value="Personal Care & Hygiene">Personal Care & Hygiene</option>
                            <option value="Other Consumer Goods">Other Consumer Goods</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Batch Number / NAFDAC Reg. / SONCAP (If visible on pack)
                    </label>
                    <input type="text" name="batch_number" x-model="formData.batch"
                           placeholder="e.g. B-94820 or NAFDAC 04-1294"
                           class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>
            </div>

            <div class="flex justify-end pt-4">
                <button type="button" @click="if(validateStep1()) step = 2" 
                        class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 transition">
                    <span>Continue to Location</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
            </div>
        </div>

        <!-- STEP 2: Location & Market -->
        <div x-show="step === 2" x-cloak class="space-y-6">
            <div>
                <h2 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-1">Step 2: Market & Purchase Location</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">Where was this item bought or discovered?</p>
            </div>

            <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            State <span class="text-red-500">*</span>
                        </label>
                        <select name="state" x-model="formData.state" required
                                class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            <option value="">Select Nigerian State</option>
                            @php
                            $states = [
                                'Abia', 'Abuja (FCT)', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
                                'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
                                'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
                                'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
                            ];
                            @endphp
                            @foreach($states as $st)
                                <option value="{{ $st }}">{{ $st }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            Purchase Price (₦ Naira, if known)
                        </label>
                        <input type="text" name="price" x-model="formData.price"
                               placeholder="e.g. ₦3,500"
                               class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Market / Street Address / Stall <span class="text-red-500">*</span>
                    </label>
                    <input type="text" name="market" x-model="formData.market" required
                           placeholder="e.g. Alaba International Market, Fancy Section, Line 4 Stall 18, Lagos"
                           class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>
            </div>

            <div class="flex justify-between pt-4">
                <button type="button" @click="step = 1" class="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    Back
                </button>
                <button type="button" @click="if(validateStep2()) step = 3" 
                        class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 transition">
                    <span>Continue to Defect & Evidence</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
            </div>
        </div>

        <!-- STEP 3: Defect & Evidence -->
        <div x-show="step === 3" x-cloak class="space-y-6">
            <div>
                <h2 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-1">Step 3: Defect Diagnosis</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">What tipped you off that this product is counterfeit?</p>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Primary Issue Observed <span class="text-red-500">*</span>
                    </label>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        @php
                        $defects = [
                            'Broken seal or tampered hologram',
                            'Altered or missing expiry date',
                            'Chemical smell or strange taste',
                            'Fake or invalid NAFDAC / SON code',
                            'Spelling errors on packaging',
                            'Device overheated / battery swollen',
                            'QR code / scratch PIN unverifiable',
                            'Severe skin reaction / health issue',
                            'Physical appearance differs from normal make, which makes it suspicious',
                            'Other Blatant Counterfeit Defect'
                        ];
                        @endphp
                        @foreach($defects as $df)
                        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition text-xs font-medium text-slate-800 dark:text-slate-200">
                            <input type="radio" name="issue" value="{{ $df }}" x-model="formData.issue" class="text-emerald-600 focus:ring-emerald-500">
                            <span>{{ $df }}</span>
                        </label>
                        @endforeach
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Detailed Description & Experience
                    </label>
                    <textarea name="details" rows="4" x-model="formData.details"
                              placeholder="Describe your inspection: e.g. 'The tablet blister pack had faded print and dissolved into powdery dust. Liquid tasted like kerosene instead of cough syrup.'"
                              class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"></textarea>
                </div>
            </div>

            <div class="flex justify-between pt-4">
                <button type="button" @click="step = 2" class="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    Back
                </button>
                <button type="button" @click="if(validateStep3()) step = 4" 
                        class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 transition">
                    <span>Continue to Photos Upload</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
            </div>
        </div>

        <!-- STEP 4: Photo & Media Upload -->
        <div x-show="step === 4" x-cloak class="space-y-6">
            <div>
                <h2 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-1">Step 4: Evidence & Photos</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">Clear photos dramatically accelerate laboratory verification and market removal.</p>
            </div>

            <div class="space-y-4">
                <div class="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 text-center hover:border-emerald-500 transition relative">
                    <input type="file" name="evidence[]" multiple accept="image/*,video/*" @change="handleFilePreview"
                           class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                        <i data-lucide="upload-cloud" class="w-7 h-7"></i>
                    </div>
                    <h3 class="font-bold text-sm text-slate-800 dark:text-white">Click or Drag & Drop Photos / Video Clips</h3>
                    <p class="text-xs text-slate-400 mt-1">Blister packs, packaging seals, batch code stamps, or purchase receipts (PNG, JPG, MP4 up to 20MB)</p>
                </div>

                <!-- Selected Files List -->
                <div x-show="fileList.length > 0" class="space-y-2">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Attached Files (<span x-text="fileList.length"></span>)</span>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <template x-for="(file, i) in fileList" :key="i">
                            <div class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs truncate flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                                <i data-lucide="image" class="w-3.5 h-3.5 text-emerald-500 shrink-0"></i>
                                <span class="truncate" x-text="file.name"></span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="flex justify-between pt-4">
                <button type="button" @click="step = 3" class="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    Back
                </button>
                <button type="button" @click="step = 5" 
                        class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 transition">
                    <span>Continue to Verification</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
            </div>
        </div>

        <!-- STEP 5: Verification & Citizen Options (100% FREE) -->
        <div x-show="step === 5" x-cloak class="space-y-6">
            <div>
                <h2 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-1">Step 5: Citizen Safety & Submission</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">Review your submission. Everything on Fake9ja is 100% free.</p>
            </div>

            <!-- Free Priority Triage Option -->
            <div class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-sm text-emerald-900 dark:text-emerald-200">Fast-Track Priority Verification</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white uppercase">Free Public Service</span>
                        </div>
                        <p class="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-1 leading-relaxed">
                            Flag this report for urgent inspection triage within 2 hours. Recommended for counterfeit infant formula, chemotherapy/antibiotic medications, or high-casualty risks.
                        </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                        <input type="checkbox" name="is_priority" value="1" x-model="formData.is_priority" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                </div>
            </div>

            <!-- Citizen Privacy & Contact Options -->
            <div class="space-y-4">
                <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                    <div class="flex items-center gap-3">
                        <i data-lucide="shield-check" class="w-5 h-5 text-emerald-500"></i>
                        <div>
                            <span class="text-sm font-bold text-slate-900 dark:text-white block">Submit 100% Anonymously</span>
                            <span class="text-xs text-slate-500">Your IP address and personal identity are never publicly published.</span>
                        </div>
                    </div>
                    <input type="checkbox" name="is_anonymous" value="1" x-model="formData.is_anonymous" class="rounded text-emerald-600 focus:ring-emerald-500">
                </div>

                <div x-show="!formData.is_anonymous" x-transition>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Optional Phone / WhatsApp / Email (For case updates)
                    </label>
                    <input type="text" name="contact" x-model="formData.contact"
                           placeholder="e.g. 0803XXXXXXX or consumer@gmail.com"
                           class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>
            </div>

            <!-- Summary Table of Submission -->
            <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div class="flex justify-between">
                    <span class="text-slate-500">Product:</span>
                    <span class="font-bold text-slate-900 dark:text-white" x-text="formData.name || 'Not specified'"></span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-500">Category:</span>
                    <span class="font-medium text-slate-900 dark:text-white" x-text="formData.category || 'Not specified'"></span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-500">Location:</span>
                    <span class="font-medium text-slate-900 dark:text-white" x-text="(formData.state ? formData.state + ' - ' : '') + (formData.market || '')"></span>
                </div>
                <div class="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span class="text-slate-500">Service Fee:</span>
                    <span class="font-bold text-emerald-600 dark:text-emerald-400">₦0.00 (100% Free Public Good)</span>
                </div>
            </div>

            <div class="flex justify-between pt-4">
                <button type="button" @click="step = 4" class="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    Back
                </button>
                <button type="submit" 
                        class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                    <span>Log Incident into Fake9ja Database</span>
                </button>
            </div>
        </div>
    </form>
</div>

@push('scripts')
<script>
    function reportWizard() {
        return {
            step: 1,
            steps: ['Product', 'Location', 'Defect', 'Evidence', 'Submit'],
            formData: {
                name: '',
                brand: '',
                category: '',
                batch: '',
                state: '',
                price: '',
                market: '',
                issue: '',
                details: '',
                is_priority: false,
                is_anonymous: true,
                contact: ''
            },
            fileList: [],
            validateStep1() {
                if (!this.formData.name.trim()) {
                    alert('Please enter the product name.');
                    return false;
                }
                if (!this.formData.category) {
                    alert('Please select a category.');
                    return false;
                }
                return true;
            },
            validateStep2() {
                if (!this.formData.state) {
                    alert('Please select a Nigerian State.');
                    return false;
                }
                if (!this.formData.market.trim()) {
                    alert('Please enter the market or purchase address.');
                    return false;
                }
                return true;
            },
            validateStep3() {
                if (!this.formData.issue) {
                    alert('Please select the primary issue observed.');
                    return false;
                }
                return true;
            },
            handleFilePreview(event) {
                this.fileList = Array.from(event.target.files);
                setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 100);
            }
        }
    }
</script>
@endpush
@endsection
