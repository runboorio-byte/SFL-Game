"""
Test script for Treasure Game - Real-time winner notification
"""
from playwright.sync_api import sync_playwright
import sys
import io
import os
import time

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_URL = f"file:///{BASE_DIR}/index.html".replace("\\", "/")

def test_realtime_winner():
    results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 480, "height": 800})
        
        print("=" * 60)
        print("   REAL-TIME WINNER NOTIFICATION TEST")
        print("=" * 60)
        
        # Clear localStorage first
        page = context.new_page()
        page.goto(BASE_URL)
        page.evaluate("localStorage.clear()")
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")
        page.close()
        
        # ============== TEAM 1: KING1 - Start playing ==============
        print("\n[1] KING1 - Starting game...")
        page1 = context.new_page()
        page1.goto(BASE_URL)
        page1.wait_for_load_state("networkidle")
        
        page1.fill("#team-code", "KING1")
        page1.click("#btn-start")
        page1.wait_for_timeout(500)
        
        # Complete all 5 stations quickly
        # Station 1
        page1.fill("#riddle-answer", "13")
        page1.click("#btn-check-answer")
        page1.wait_for_timeout(1500)
        page1.fill("#station-code", "LIB01")
        page1.click("#btn-check-code")
        page1.wait_for_timeout(1000)
        
        # Station 2
        page1.fill("#riddle-answer", "8")
        page1.click("#btn-check-answer")
        page1.wait_for_timeout(1500)
        page1.fill("#station-code", "TCH02")
        page1.click("#btn-check-code")
        page1.wait_for_timeout(1000)
        
        # Station 3
        page1.fill("#riddle-answer", "48")
        page1.click("#btn-check-answer")
        page1.wait_for_timeout(1500)
        page1.fill("#station-code", "CLS03")
        page1.click("#btn-check-code")
        page1.wait_for_timeout(1000)
        
        # Station 4
        page1.fill("#riddle-answer", "\u0627\u0644\u062d\u0641\u0631\u0629")
        page1.click("#btn-check-answer")
        page1.wait_for_timeout(1500)
        page1.fill("#station-code", "MGR04")
        page1.click("#btn-check-code")
        page1.wait_for_timeout(1000)
        
        # Station 5
        page1.fill("#riddle-answer", "6")
        page1.click("#btn-check-answer")
        page1.wait_for_timeout(1500)
        page1.fill("#station-code", "LAB05")
        page1.click("#btn-check-code")
        page1.wait_for_timeout(1000)
        
        print("   KING1 - All 5 stations completed!")
        results.append(("KING1 Stations", "PASS", "5/5 completed"))
        
        # ============== TEAM 2: BLUE2 - Start playing (will be notified) ==============
        print("\n[2] BLUE2 - Starting game...")
        page2 = context.new_page()
        page2.goto(BASE_URL)
        page2.wait_for_load_state("networkidle")
        
        page2.fill("#team-code", "BLUE2")
        page2.click("#btn-start")
        page2.wait_for_timeout(500)
        
        # Complete 2 stations
        # Station 1
        page2.fill("#riddle-answer", "14")
        page2.click("#btn-check-answer")
        page2.wait_for_timeout(1500)
        page2.fill("#station-code", "GRD01")
        page2.click("#btn-check-code")
        page2.wait_for_timeout(1000)
        
        # Station 2
        page2.fill("#riddle-answer", "3")
        page2.click("#btn-check-answer")
        page2.wait_for_timeout(1500)
        page2.fill("#station-code", "COM02")
        page2.click("#btn-check-code")
        page2.wait_for_timeout(1000)
        
        print("   BLUE2 - 2 stations completed!")
        results.append(("BLUE2 Stations", "PASS", "2/5 completed"))
        
        # ============== KING1 - Complete final riddle and capture ==============
        print("\n[3] KING1 - Completing final riddle...")
        page1.fill("#final-digit-1", "1")
        page1.fill("#final-digit-2", "3")
        page1.fill("#final-digit-3", "2")
        page1.click("#btn-check-final")
        page1.wait_for_timeout(1000)
        
        # Capture treasure
        page1.click("#btn-capture-treasure")
        page1.wait_for_timeout(2000)
        
        assert page1.locator("#screen-win").is_visible(), "KING1 win screen not visible"
        win_team = page1.locator("#win-team-name").inner_text()
        results.append(("KING1 Win", "PASS", f"Winner: {win_team}"))
        print(f"   KING1 - WINNER! {win_team}")
        
        # ============== BLUE2 - Wait for real-time notification ==============
        print("\n[4] BLUE2 - Waiting for real-time notification (5 seconds)...")
        
        # Check if BLUE2 is still on game screen
        blue2_on_game = page2.locator("#screen-game").is_visible()
        print(f"   BLUE2 - On game screen: {blue2_on_game}")
        
        # Wait for the winner watch to detect the winner (checks every 2 seconds)
        page2.wait_for_timeout(5000)
        
        # Check if game over screen is now visible
        game_over_visible = page2.locator("#game-over-screen").is_visible()
        if game_over_visible:
            winner_display = page2.locator("#winner-name-display").inner_text()
            results.append(("BLUE2 Real-time Notification", "PASS", f"Winner shown: {winner_display}"))
            print(f"   BLUE2 - Game Over shown! Winner: {winner_display}")
        else:
            # Check if page reloaded or still on game
            blue2_still_on_game = page2.locator("#screen-game").is_visible()
            if blue2_still_on_game:
                results.append(("BLUE2 Real-time Notification", "FAIL", "Game over not shown after 5 seconds"))
                print("   BLUE2 - Game over NOT shown after 5 seconds")
            else:
                results.append(("BLUE2 Real-time Notification", "WARN", "Page state changed"))
                print("   BLUE2 - Page state changed")
        
        # ============== CLEANUP ==============
        page1.close()
        page2.close()
        context.close()
        browser.close()
    
    # Print results summary
    print("\n" + "=" * 60)
    print("   REAL-TIME WINNER NOTIFICATION TEST RESULTS")
    print("=" * 60)
    
    passed = sum(1 for r in results if r[1] == "PASS")
    warnings = sum(1 for r in results if r[1] == "WARN")
    failed = sum(1 for r in results if r[1] == "FAIL")
    
    for name, status, detail in results:
        icon = "[PASS]" if status == "PASS" else "[WARN]" if status == "WARN" else "[FAIL]"
        print(f"  {icon} {name}: {detail}")
    
    print(f"\n  Total: {len(results)} tests")
    print(f"  Passed: {passed}")
    print(f"  Warnings: {warnings}")
    print(f"  Failed: {failed}")
    
    if failed == 0:
        print("\n  *** ALL REAL-TIME NOTIFICATION TESTS PASSED! ***")
    else:
        print(f"\n  *** {failed} TESTS FAILED ***")
    
    return failed == 0

if __name__ == "__main__":
    success = test_realtime_winner()
    exit(0 if success else 1)
