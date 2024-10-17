// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qocsnijckjfgplvujqcc.supabase.co';  // Found in Supabase -> Settings -> API
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvY3NuaWpja2pmZ3BsdnVqcWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMDM5ODQsImV4cCI6MjA0NDU3OTk4NH0.ooqDBeFf0XNITnM3DO80cDmw9ztwEJP-WKXYEwQI7ik';  // Found in Supabase -> Settings -> API
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
